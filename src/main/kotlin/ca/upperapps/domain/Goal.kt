package ca.upperapps.domain

import com.fasterxml.jackson.annotation.JsonInclude
import io.quarkus.mongodb.panache.common.MongoEntity
import io.quarkus.mongodb.panache.kotlin.PanacheMongoCompanion
import io.quarkus.mongodb.panache.kotlin.PanacheMongoEntity
import org.valiktor.functions.hasSize
import org.valiktor.functions.isNotBlank

@MongoEntity(collection = "goals")
@JsonInclude(JsonInclude.Include.NON_NULL)
class Goal(): PanacheMongoEntity() {
    companion object: PanacheMongoCompanion<Goal> {
        fun validate(goal: Goal) {
            org.valiktor.validate(goal) {
                validate(Goal::name).isNotBlank().hasSize(1, 30)
                validate(Goal::description).hasSize(0, 140)
            }
        }
    }

    constructor(name: String, user: User): this() {
        this.name = name
        this.user = user
    }

    lateinit var name: String
    val description: String? = null
    lateinit var user: User
    var criteria: List<Criteria>? = null
    var options: List<Option>? = null
    var judgementMatrix: JudgementMatrix? = null
    var scenario: List<Scenario>? = null
}