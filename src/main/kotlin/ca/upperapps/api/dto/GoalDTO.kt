package ca.upperapps.api.dto

import ca.upperapps.domain.Goal
import ca.upperapps.domain.User
import org.bson.types.ObjectId

data class GoalDTO(
    val id: ObjectId? = null,
    val name: String,
    val user: User,
    var description: String? = null,
    var criteria: List<CriteriaDTO>? = null
) {

    fun toDomain(): Goal {
        val goal = Goal()
        val criteria = this.criteria?.map { c -> c.toDomain() }
        goal.id = this.id
        goal.name = this.name
        goal.user = this.user
        goal.description = this.description
        goal.criteria = criteria

        return goal
    }
}

