package ca.upperapps.api.dto.`in`

import ca.upperapps.domain.Criteria
import org.bson.types.ObjectId

data class CriteriaDTO(
    val definition: String
) {
    fun toDomain(): Criteria {
        return Criteria(
            id = ObjectId(),
            definition = definition
        )
    }
}
