
const getFeedbackCategoryColor = (category) => {
    let categoryColor = "#808080"

    if (category == "technical_support") {
        categoryColor = "#ea580c";
    } else if (category == "billing_support") {
        categoryColor = "#0d9488"
    } else if (category == "security_issue") {
        categoryColor = "#7f1d1d"
    } else if (category == "car_park_issue") {
        categoryColor = "#65a30d"
    } else if (category == "defect_of_common_area") {
        categoryColor = "#312e81"
    } else if (category == "suggestion") {
        categoryColor = "#701a75"
    } else { categoryColor == "#808080" }

    return categoryColor;
}

const getFeedbackCategoryBGColor = (category) => {

    let categoryColor = "#e9eff7"

    if (category == "technical_support") {
        categoryColor = "#ffebd4";
    } else if (category == "billing_support") {
        categoryColor = "#dcfff8"
    } else if (category == "security_issue") {
        categoryColor = "#ffdede"
    } else if (category == "car_park_issue") {
        categoryColor = "#edfbd3"
    } else if (category == "defect_of_common_area") {
        categoryColor = "#e0e5fa"
    } else if (category == "suggestion") {
        categoryColor = "#f9e3ff"
    } else { categoryColor == "#e9eff7" }

    return categoryColor;

}

const getFeedbackCategoryLabel = (category) => {
    let categoryLabel = "others";

    if (category == "technical_support") {
        categoryLabel = "Techinical Support";
    } else if (category == "billing_support") {
        categoryLabel = "Billing Support";
    } else if (category == "security_issue") {
        categoryLabel = "Security Issue";
    } else if (category == "car_park_issue") {
        categoryLabel = "Car Park Issue";
    } else if (category == "defect_of_common_area") {
        categoryLabel = "Defect of Common Area";
    } else if (category == "suggestion") {
        categoryLabel = "Suggestion";
    } else { categoryLabel == "others" }


    return categoryLabel;
}

const getTodayDate = () => {
    var today = new Date();
    return today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
}

const getCurrentTime = () => {
    var today = new Date();
    return today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
}

const getStatusColor = (status) => {
    if (status == 'pending')
        return 'yellow'
    else if (status == 'rejected')
        return 'red'
    else if (status == 'approved')
        return 'green'
    else return 'gray'
}

const getStatusBG = (status) => {
    if (status == 'pending')
        return '#FFEFD8'
    else if (status == 'rejected')
        return '#FBDADB'
    else if (status == 'approved')
        return '#E9FFD8'
    else return '#EFEFEF'
}

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export {
    getFeedbackCategoryColor, getFeedbackCategoryBGColor, getFeedbackCategoryLabel, getTodayDate, getCurrentTime,
    getStatusBG, getStatusColor, capitalizeFirstLetter
};