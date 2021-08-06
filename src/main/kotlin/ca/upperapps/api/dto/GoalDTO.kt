package ca.upperapps.api.dto

import ca.upperapps.domain.*
import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonProperty
import org.bson.types.ObjectId

@JsonInclude(JsonInclude.Include.NON_NULL)
data class GoalDTO(
    val id: ObjectId? = null,
    val goal: String,
    val user: User,
    val description: String? = null,
    val criteria: List<CriteriaDTO>? = null,
    val options: List<Option>? = null,
    @JsonProperty("judgement-matrix") val judgementMatrix: JudgementMatrix? = null,
    val scenario: List<Scenario>? = null
) {

    companion object {
        fun fromDomain(goal: Goal): GoalDTO {
            return GoalDTO(
                goal.id,
                goal.goal,
                goal.user,
                goal.description,
                goal.criteria?.map { criteria ->  CriteriaDTO.fromDomain(criteria) },
                goal.options,
                goal.judgementMatrix,
                goal.scenario
            )
        }
    }

    fun toDomain(): Goal {
        return Goal(
            id = id,
            goal = goal,
            user = user,
            description = description,
            criteria = criteria?.map { criteriaDTO -> criteriaDTO.toDomain() },
            options = options,
            judgementMatrix = judgementMatrix,
            scenario = scenario
        )
    }
}

