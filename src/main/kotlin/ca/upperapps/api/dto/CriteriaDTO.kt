package ca.upperapps.api.dto

import ca.upperapps.domain.Criteria
import org.bson.types.ObjectId

data class CriteriaDTO(val id: ObjectId, val name: String) {
    fun toDomain(): Criteria {
        return Criteria(id, name)
    }
}
