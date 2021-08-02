package ca.upperapps.api

import ca.upperapps.domain.User
import ca.upperapps.domain.UserRepository
import ca.upperapps.domain.errorhandling.ErrorHandlerUtils
import org.bson.types.ObjectId
import org.valiktor.ConstraintViolationException
import java.net.URI
import java.util.logging.Logger
import javax.inject.Inject
import javax.ws.rs.*
import javax.ws.rs.core.MediaType
import javax.ws.rs.core.Response

@Path("/users")
class UsersResource {
    companion object {
        @Suppress("JAVA_CLASS_ON_COMPANION")
        private val logger: Logger = Logger.getLogger(javaClass.enclosingClass.name)
    }

    @Inject lateinit var userRepository: UserRepository

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    fun listAll(): Response = Response.ok(userRepository.listAll()).build()

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/{id}")
    fun getUser(@PathParam("id") id: String): Response {
        try {
            val user = userRepository.findById(ObjectId(id))
            if (user != null) {
                return Response.ok(user).build()
            }
        } catch (e: IllegalArgumentException) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Invalid id format $id").build()
        }
        return Response.status(Response.Status.NOT_FOUND).entity("User not found for id $id").build()
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    fun createUser(user: User): Response {
        return try {
            User.validate(user)
            userRepository.persist(user)
            Response.created(URI.create("/users/${user.id}")).entity(user).build()
        } catch (e: ConstraintViolationException) {
            Response.status(Response.Status.BAD_REQUEST)
                .entity(ErrorHandlerUtils.getValidationMessage(e))
                .build()
        }
    }

    @PUT
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    fun updateUser(updatedUser: User): Response {
        return try {
            User.validate(updatedUser)
            userRepository.update(updatedUser)
            Response.created(URI.create("/users/${updatedUser.id}")).entity(updatedUser).build()
        } catch (e: ConstraintViolationException) {
            Response.status(Response.Status.BAD_REQUEST)
                .entity(ErrorHandlerUtils.getValidationMessage(e))
                .build()
        }
    }

    @DELETE
    @Path("/{id}")
    fun deleteUser(@PathParam("id") id: String): Response {
        userRepository.deleteById(ObjectId(id))
        return Response.noContent().build()
    }
}