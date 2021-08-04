package ca.upperapps.domain

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonInclude.Include
import com.fasterxml.jackson.annotation.JsonProperty
import io.quarkus.mongodb.panache.common.MongoEntity
import io.quarkus.mongodb.panache.kotlin.PanacheMongoEntityBase
import org.bson.codecs.pojo.annotations.BsonCreator
import org.bson.codecs.pojo.annotations.BsonId
import org.bson.codecs.pojo.annotations.BsonProperty
import org.bson.types.ObjectId
import org.valiktor.functions.hasSize
import org.valiktor.functions.isEmail
import org.valiktor.functions.isNotBlank
import org.valiktor.validate


@MongoEntity(collection = "users")
@JsonInclude(Include.NON_NULL)
data class User @BsonCreator constructor(
    @BsonId val id: ObjectId? = null,
    @JsonProperty("first-name") @BsonProperty("firstName") val firstName: String,
    @JsonProperty("last-name") @BsonProperty("lastName") val lastName: String,
    @BsonProperty("username") val username: String,
    @BsonProperty("email") val email: String,
    @BsonProperty("password") val password: String? = null
) : PanacheMongoEntityBase() {
    init {
        validate(this) {
            validate(User::firstName).isNotBlank().hasSize(1, 15)
            validate(User::lastName).isNotBlank().hasSize(1, 15)
            validate(User::email).isNotBlank().isEmail()
            validate(User::username).hasSize(5, 15)
        }
    }
}