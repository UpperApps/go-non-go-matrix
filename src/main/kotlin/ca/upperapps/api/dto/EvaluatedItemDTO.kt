package ca.upperapps.api.dto

import ca.upperapps.domain.EvaluatedItem
import com.fasterxml.jackson.annotation.JsonInclude
import org.bson.types.ObjectId

@JsonInclude(JsonInclude.Include.NON_NULL)
data class EvaluatedItemDTO(
    val id: ObjectId?,
    val name: String,
    val description: String? = null,
    val score: Map<String, Int>? = null
) {

    companion object {
        fun fromDomain(evaluatedItem: EvaluatedItem): EvaluatedItemDTO {
            return EvaluatedItemDTO(
                evaluatedItem.id,
                evaluatedItem.name,
                evaluatedItem.description,
                evaluatedItem.score
            )
        }
    }

    fun toDomain(): EvaluatedItem {
        return EvaluatedItem(
            id = this.id ?: ObjectId(),
            name = this.name,
            description = this.description,
            score = this.score
        )
    }
}
