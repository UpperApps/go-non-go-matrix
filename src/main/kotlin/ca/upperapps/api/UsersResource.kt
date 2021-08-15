package ca.upperapps.api

import ca.upperapps.api.dto.UserDTO
import ca.upperapps.domain.UserRepository
import ca.upperapps.domain.exceptions.ErrorHandlerUtils
import org.bson.types.ObjectId
import org.eclipse.microprofile.openapi.annotations.tags.Tag
import org.valiktor.ConstraintViolationException
import java.net.URI
import java.util.logging.Logger
import javax.inject.Inject
import javax.ws.rs.*
import javax.ws.rs.core.MediaType
import javax.ws.rs.core.Response

@Path("/users")
@Tag(name = "User Resource", description = "Resource responsible for user operations.")
class UsersResource {
    companion object {
        @Suppress("JAVA_CLASS_ON_COMPANION")
        private val logger: Logger = Logger.getLogger(javaClass.enclosingClass.name)
    }

    @Inject lateinit var userRepository: UserRepository

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    fun listAll(): Response = Response.ok(userRepository.listAll().map { user -> UserDTO.fromDomain(user) }).build()

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/{id}")
    fun getUser(@PathParam("id") id: String): Response {
        return try {
            val user = userRepository.findById(ObjectId(id))

            if (user != null) Response.ok(UserDTO.fromDomain(user)).build()
            else Response.status(Response.Status.NOT_FOUND).entity("User not found for id $id").build()

        } catch (e: IllegalArgumentException) {
            Response.status(Response.Status.BAD_REQUEST).entity("Invalid id format $id").build()
        }
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    fun createUser(userDTO: UserDTO): Response {
        return try {
            val newUser = userDTO.toDomain()
            userRepository.persist(newUser)
            Response.created(URI.create("/users/${newUser.id}")).entity(newUser).build()
        } catch (e: ConstraintViolationException) {
            Response.status(Response.Status.BAD_REQUEST)
                .entity(ErrorHandlerUtils.getValidationMessage(e))
                .build()
        } catch (e: Exception) {
            return Response.noContent().build()
        } catch (e: IllegalArgumentException) {
            Response.status(Response.Status.BAD_REQUEST).entity(e.message).build()
        }
    }

    @PUT
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    fun updateUser(updatedUserDTO: UserDTO): Response {
        return try {
            val updatedUser = updatedUserDTO.toDomain()
            userRepository.update(updatedUser)
            Response.created(URI.create("/users/${updatedUser.id}")).entity(updatedUser).build()
        } catch (e: ConstraintViolationException) {
            Response.status(Response.Status.BAD_REQUEST)
                .entity(ErrorHandlerUtils.getValidationMessage(e))
                .build()
        } catch (e: IllegalArgumentException) {
            Response.status(Response.Status.BAD_REQUEST).entity(e.message).build()
        }
    }

    @DELETE
    @Path("/{id}")
    fun deleteUser(@PathParam("id") id: String): Response {
        userRepository.deleteById(ObjectId(id))
        return Response.noContent().build()
    }
}