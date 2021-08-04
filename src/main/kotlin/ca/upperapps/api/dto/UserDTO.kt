package ca.upperapps.api.dto

import ca.upperapps.domain.User
import com.fasterxml.jackson.annotation.JsonProperty
import org.bson.types.ObjectId

data class UserDTO(
    val id: ObjectId? = null,
    @JsonProperty("first-name") val firstName: String,
    @JsonProperty("last-name") val lastName: String,
    val username: String,
    val email: String,
    val password: String? = null
) {
    fun toDomain(): User {
        return User(id, firstName, lastName, username, email, password)
    }
}
