package ca.upperapps.domain

import org.bson.types.ObjectId
import org.valiktor.functions.hasSize
import org.valiktor.functions.isNotBlank
import org.valiktor.validate

data class Criteria(
    val id: ObjectId? = ObjectId(),
    val definition: String
) {
    init {
        validate(this) {
            validate(Criteria::definition).isNotBlank().hasSize(1, 300)
        }
    }
}
