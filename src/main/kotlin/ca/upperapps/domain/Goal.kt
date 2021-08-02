package ca.upperapps.domain

import ca.upperapps.domain.errorhandling.ErrorHandlerUtils
import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonProperty
import io.quarkus.mongodb.panache.common.MongoEntity
import org.bson.types.ObjectId
import org.valiktor.ConstraintViolationException
import org.valiktor.functions.hasSize
import org.valiktor.functions.isNotBlank
import org.valiktor.validate
import java.util.logging.Level
import java.util.logging.Logger

@MongoEntity(collection = "goals")
@JsonInclude(JsonInclude.Include.NON_NULL)
class Goal() {
    companion object {
        @Suppress("JAVA_CLASS_ON_COMPANION")
        private val logger: Logger = Logger.getLogger(javaClass.enclosingClass.name)

        fun validate(goal: Goal) {
            try {
                validate(goal) {
                    validate(Goal::name).isNotBlank().hasSize(1, 30)
                    validate(Goal::description).hasSize(0, 140)
                }
            } catch (e: ConstraintViolationException) {
                logger.log(Level.WARNING, ErrorHandlerUtils.getValidationMessage(e).toString())
                throw  e
            }
        }
    }

    var id: ObjectId? = null
    lateinit var  name: String
    lateinit var user: User
    var description: String? = null
    var criteria: List<Criteria>? = null
    var options: List<Option>? = null
    @JsonProperty("judgement-matrix")
    var judgementMatrix: JudgementMatrix? = null
    var scenario: List<Scenario>? = null
}