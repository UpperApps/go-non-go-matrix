package ca.upperapps.domain

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonInclude.Include
import com.fasterxml.jackson.annotation.JsonProperty
import io.quarkus.mongodb.panache.common.MongoEntity
import io.quarkus.mongodb.panache.kotlin.PanacheMongoCompanion
import io.quarkus.mongodb.panache.kotlin.PanacheMongoEntity
import org.valiktor.functions.hasSize
import org.valiktor.functions.isEmail
import org.valiktor.functions.isNotBlank
import org.valiktor.validate


@MongoEntity(collection = "users")
@JsonInclude(Include.NON_NULL)
class User: PanacheMongoEntity() {
    companion object: PanacheMongoCompanion<User> {
        fun validate(user: User) {
            validate(user) {
                validate(User::firstName).isNotBlank().hasSize(1, 15)
                validate(User::lastName).isNotBlank().hasSize(1, 15)
                validate(User::email).isNotBlank().isEmail()
                validate(User::username).hasSize(5, 15)
            }
        }
    }

    @JsonProperty("first-name")
    lateinit var firstName: String
    @JsonProperty("last-name")
    lateinit var lastName: String
    lateinit var username: String
    lateinit var email: String
    val password: String? = null
}