import ajv = require("ajv");

import { Validation } from "../Types";

class Schema {
    private static validator: ajv.Ajv = ajv();
}

export default Schema;