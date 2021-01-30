
function checkRequiredFields(body) {
    let {rule , data } = body;
    if(!data && !rule){
        return returnMethod("data and rule is required.", "error", null);
    }
    if(!data){
        return returnMethod("data is required.", "error", null);
    }
    if(!rule){
        return returnMethod("rule is required.", "error", null);
    }
    return null;
}

function checkRuleDataType(rule) {
    if(typeof rule !== 'object' ){
        return returnMethod("rule should be an object.", "error", null);
    }
    return null;
}

function checkRequiredRuleFields(rule) {
    let {field, condition, condition_value} = rule;
    if(!field){
        return returnMethod("field is required.", "error", null);
    }
    if(!condition){
        return returnMethod("condition is required.", "error", null);
    }
    if(!condition_value){
        return returnMethod("condition_value is required.", "error", null);
    }
    if(condition !== 'eq' && condition !== 'neq' && condition !== 'gt' && condition !== 'gte' && condition !== 'contains'){
        return returnMethod("condition not accepted.", "error", null);
    }
    return null;
}

function checkRuleDataFieldType(data) {
    if(typeof data !== 'object' && typeof data !== 'array' && typeof data !== 'string' ){
        return returnMethod("data should be either an object or an array or a string.", "error", null);
    }
    return null;
}

function returnMethod(message, status, data) {
    return {message, status, data};
}


  
module.exports = {
    validate:  (req, res, next) => {
        let body = req.body;

        
        // check required fields in BODY
        let to_checkRequiredFields = checkRequiredFields(body);
        if(to_checkRequiredFields)
        return res.status(400).send(to_checkRequiredFields);
    
        let {rule , data } = body;
        // check the data type of RULE
        let to_checkRuleDataType= checkRuleDataType(rule);
        if(to_checkRuleDataType)
        return res.status(400).send(to_checkRuleDataType);
    
        // check if all required fields in RULE are present
        let to_checkRequiredRuleFields= checkRequiredRuleFields(rule);
        if(to_checkRequiredRuleFields)
        return res.status(400).send(to_checkRequiredRuleFields);
    
        // check data type for DATA
        let to_checkRuleDataFieldType= checkRuleDataFieldType(data);
        if(to_checkRuleDataFieldType)
        return res.status(400).send(to_checkRuleDataFieldType);

        next();
    }};