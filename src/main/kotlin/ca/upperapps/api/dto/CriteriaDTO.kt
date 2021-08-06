package ca.upperapps.api.dto

import ca.upperapps.domain.Criteria
import org.bson.types.ObjectId

data class CriteriaDTO(val id: ObjectId?, val definition: String) {
    companion object {
        fun fromDomain(criteria: Criteria): CriteriaDTO {
            return CriteriaDTO(
                criteria.id,
                criteria.definition
            )
        }
    }

    fun toDomain(): Criteria {
        return Criteria(id, definition)
    }
}
