package ca.upperapps.api

import ca.upperapps.api.dto.GoalDTO
import ca.upperapps.domain.Criteria
import ca.upperapps.domain.Goal
import ca.upperapps.domain.GoalRepository
import ca.upperapps.domain.Option
import ca.upperapps.domain.errorhandling.ErrorHandlerUtils
import org.bson.types.ObjectId
import org.valiktor.ConstraintViolationException
import java.net.URI
import java.util.logging.Level
import java.util.logging.Logger
import javax.inject.Inject
import javax.ws.rs.*
import javax.ws.rs.core.MediaType
import javax.ws.rs.core.Response

@Path("/goals")
class GoalResource {
    companion object {
        @Suppress("JAVA_CLASS_ON_COMPANION")
        private val logger: Logger = Logger.getLogger(javaClass.enclosingClass.name)
    }

    @Inject lateinit var goalRepository: GoalRepository

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    fun listAll(): Response = Response.ok(goalRepository.listAll()).build()

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/{id}")
    fun getGoal(@PathParam("id") id: String): Response {
        try {
            val goal = goalRepository.findById(ObjectId(id))
            if (goal != null) {
                return Response.ok(goal).build()
            }
        } catch (e: IllegalArgumentException) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Invalid id format $id").build()
        }
        return Response.status(Response.Status.NOT_FOUND).entity("Goal not found for id $id").build()
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    fun createGoal(goalDTO: GoalDTO): Response {
        return try {
            val goal = goalDTO.toDomain()

            logger.log(Level.WARNING, "GoalDTO $goalDTO")
            logger.log(Level.WARNING, "Goal Domain $goal")

            Goal.validate(goal)
            goalRepository.persist(goal)
            Response.created(URI.create("/goals/${goal.id}")).entity(goal).build()
        } catch (e: ConstraintViolationException) {
            Response.status(Response.Status.BAD_REQUEST)
                .entity(ErrorHandlerUtils.getValidationMessage(e))
                .build()
        }
    }

    @PUT
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    fun updateGoal(updatedGoal: Goal): Response {
        return try {


            Response.created(URI.create("/goals/${updatedGoal.id}")).entity(updatedGoal).build()
        } catch (e: ConstraintViolationException) {
            Response.status(Response.Status.BAD_REQUEST)
                .entity(ErrorHandlerUtils.getValidationMessage(e))
                .build()
        }
    }

    @DELETE
    @Path("/{id}")
    fun deleteGoal(@PathParam("id") id: String): Response {
        goalRepository.deleteById(ObjectId(id))
        return Response.noContent().build()
    }

    // TODO Implement this method
    @GET
    @Path("/{goalId}/criteria")
    @Produces(MediaType.APPLICATION_JSON)
    fun listAllCriteria(@PathParam("goalId") goalId: String): Response = Response.ok().build()

    @POST
    @Path("/{goalId}/criteria")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    fun saveCriteria(criteria: List<Criteria>): Response {
        // TODO Implement this method

        return Response.ok().build()
    }

    @PUT
    @Path("/{goalId}/criteria")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    fun updateCriteria(updatedCriteria: List<Criteria>): Response {

        // TODO Implement this method
        return Response.ok().build()
    }

    @DELETE
    @Path("/{goalId}/criteria/{criteriaId}")
    fun deleteCriteria(@PathParam("goalId") goalId: String, @PathParam("criteriaId") criteriaId: String): Response {
        // TODO Implement this method

        return Response.noContent().build()
    }

    // TODO Implement this method
    @GET
    @Path("/{goalId}/options")
    @Produces(MediaType.APPLICATION_JSON)
    fun listAllOptions(@PathParam("goalId") goalId: String): Response = Response.ok().build()

    @POST
    @Path("/{goalId}/options")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    fun saveOptions(option: List<Option>): Response {
        // TODO Implement this method

        return Response.ok().build()
    }

    @PUT
    @Path("/{goalId}/options")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    fun updateOptions(updatedOption: List<Option>): Response {

        // TODO Implement this method
        return Response.ok().build()
    }

    @DELETE
    @Path("/{goalId}/options/{optionId}")
    fun deleteOption(@PathParam("goalId") goalId: String, @PathParam("optionId") optionId: String): Response {
        // TODO Implement this method

        return Response.noContent().build()
    }
}