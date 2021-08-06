package ca.upperapps.api.dto

import ca.upperapps.domain.*
import com.fasterxml.jackson.annotation.JsonProperty
import org.bson.types.ObjectId

data class GoalDTO(
    val id: ObjectId? = null,
    val name: String,
    val user: User,
    val description: String? = null,
    val criteria: List<CriteriaDTO>? = null,
    val options: List<Option>? = null,
    @JsonProperty("judgement-matrix") val judgementMatrix: JudgementMatrix? = null,
    val scenario: List<Scenario>? = null
) {

    fun toDomain(): Goal {
        return Goal(
            id = id,
            name = name,
            user = user,
            description = description,
            criteria = criteria?.map { c -> c.toDomain() },
            options = options,
            judgementMatrix = judgementMatrix,
            scenario = scenario
        )
    }
}

