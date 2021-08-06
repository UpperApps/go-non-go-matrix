package ca.upperapps.api.dto

import ca.upperapps.domain.Goal
import ca.upperapps.domain.JudgementMatrix
import ca.upperapps.domain.Option
import ca.upperapps.domain.Scenario
import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonProperty
import org.bson.types.ObjectId

@JsonInclude(JsonInclude.Include.NON_NULL)
data class GoalDTO(
    val id: ObjectId?,
    val goal: String,
    val user: UserDTO,
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
                UserDTO.fromDomain(goal.user),
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
            id = id ?: ObjectId(),
            goal = goal,
            user = user.toDomain(),
            description = description,
            criteria = criteria?.map { criteriaDTO -> criteriaDTO.toDomain() },
            options = options,
            judgementMatrix = judgementMatrix,
            scenario = scenario
        )
    }
}

