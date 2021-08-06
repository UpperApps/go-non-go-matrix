package ca.upperapps.domain

import com.fasterxml.jackson.annotation.JsonInclude
import org.bson.types.ObjectId
import org.valiktor.functions.hasSize
import org.valiktor.functions.isNotBlank
import org.valiktor.validate

@JsonInclude(JsonInclude.Include.NON_NULL)
data class Criteria (val id: ObjectId? = ObjectId(), val name: String){
    init {
        validate(this) {
            validate(Criteria::name).isNotBlank().hasSize(1, 50)
        }
    }
}
