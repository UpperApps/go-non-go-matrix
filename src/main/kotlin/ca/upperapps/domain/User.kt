package ca.upperapps.domain

import ca.upperapps.domain.errorhandling.ErrorHandlerUtils
import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonInclude.Include
import com.fasterxml.jackson.annotation.JsonProperty
import io.quarkus.mongodb.panache.common.MongoEntity
import io.quarkus.mongodb.panache.kotlin.PanacheMongoCompanion
import io.quarkus.mongodb.panache.kotlin.PanacheMongoEntity
import org.bson.types.ObjectId
import org.valiktor.ConstraintViolationException
import org.valiktor.functions.hasSize
import org.valiktor.functions.isEmail
import org.valiktor.functions.isNotBlank
import org.valiktor.validate
import java.util.*
import java.util.logging.Level
import java.util.logging.Logger
import javax.validation.constraints.Email


@MongoEntity(collection = "users")
@JsonInclude(Include.NON_NULL)
class User() {
    companion object {
        @Suppress("JAVA_CLASS_ON_COMPANION")
        private val logger: Logger = Logger.getLogger(javaClass.enclosingClass.name)

        fun validate(user: User) {
            try {
                validate(user) {
                    validate(User::firstName).isNotBlank().hasSize(1, 15)
                    validate(User::lastName).isNotBlank().hasSize(1, 15)
                    validate(User::email).isNotBlank().isEmail()
                    validate(User::username).hasSize(5, 15)
                }
            } catch (e: ConstraintViolationException) {
                logger.log(Level.WARNING, ErrorHandlerUtils.getValidationMessage(e).toString())
                throw  e
            }
        }
    }

    var id: ObjectId? = null
    @JsonProperty("first-name")
    lateinit var firstName: String
    @JsonProperty("last-name")
    lateinit var lastName: String
    lateinit var username: String
    lateinit var email: String
    val password: String? = null
}