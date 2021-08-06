package ca.upperapps.domain

import org.bson.types.ObjectId
import org.valiktor.functions.hasSize
import org.valiktor.validate

data class Option(
    val id: ObjectId? = ObjectId(),
    val name: String,
    val description: String? = null,
    var optionScore: Map<Criteria, Int>? = null
) {
    init {
        validate(this) {
            validate(Option::name).hasSize(5, 30)
            validate(Option::description).hasSize(0, 140)
        }
    }
}