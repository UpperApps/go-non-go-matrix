package ca.upperapps.domain

import org.valiktor.functions.hasSize
import org.valiktor.validate
import java.util.*

data class Option(
    val id: String = UUID.randomUUID().toString(),
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