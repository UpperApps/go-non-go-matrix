package ca.upperapps.api.dto

import ca.upperapps.domain.Option
import org.bson.types.ObjectId

data class OptionDTO(
    val id: ObjectId? = ObjectId(),
    val name: String,
    val description: String? = null,
) {

    companion object {
        fun fromDomain(option: Option): OptionDTO {
            return OptionDTO(
                option.id,
                option.name,
                option.description,
            )
        }
    }

    fun toDomain(): Option {
        return Option(
            this.id,
            this.name,
            this.description,
        )
    }
}
