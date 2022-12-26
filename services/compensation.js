const getModel = require('tools/get-model');

const fetchCompensationData = async (params) => {
    const { id, industry, title, salary, currency_main, city, state, country, title_description, currency_other, age_range, experience_range, timestamp } = params;
    const searchBody = {
        ...(id && { _id: id.trim() }),
        ...(industry && { industry: industry.trim() }),
        ...(title && { title: title.trim() }),
        ...(salary && { salary: [Number(salary.gte), Number(salary.lte)] }),
        ...(currency_main && { currency_main: currency_main.trim() }),
        ...(city && { city: city.trim() }),
        ...(state && { state: state.trim() }),
        ...(country && { country: country.trim() }),
        ...(title_description && { title_description: title_description.trim() }),
        ...(currency_other && { currency_other: currency_other.trim() }),
        ...(age_range && { age_range: [Number(age_range.gte), Number(age_range.lte)] }),
        ...(experience_range && { experience_range: [Number(experience_range.gte), Number(experience_range.lte)] }),
        ...(timestamp && { timestamp: [timestamp.gte, timestamp.lte] })
    };

    params.search = searchBody;
    params.sorter = {
        field: params.sort_by,
        order: params.sort_dir == 'asc' ? 1 : -1
    };
    if (params.start) params.start = Number(params.start);
    if (params.limit) params.limit = Number(params.limit);

    const propsToMatch = ['case_id', 'industry', 'title', 'currency_main', 'city', 'state', 'country', 'title_description', 'currency_other'];
    const propsToRange = ['salary', 'age_range', 'experience_range', 'timestamp'];

    const filter = {};

    if (params.search) {
        for (const [key, value] of Object.entries(params.search)) {
            if (propsToMatch.includes(key)) {
                // Regex match, add key-value to filter
                filter[key] = { $regex: value, $options: 'i' };
            }
            else if (propsToRange.includes(key)) {
                // Add range match to filter
                filter[key] = {
                    ...(value[0] && { $gte: value[0] }),
                    ...(value[1] && { $lte: value[1] })
                };
            }
        }
    }


    const CompensationModel = getModel('compensation');
    const count = await CompensationModel.countDocuments(filter);
    const data = await CompensationModel.find(
        filter,
        null,
        {
            skip: params.start || 0,
            limit: params.limit != null ? params.limit : 100,
            ...(params.sorter && { sort: { [params.sorter.field]: params.sorter.order } })
        }
    );

    return { count, data };

}

module.exports = {
    fetchCompensationData
};
