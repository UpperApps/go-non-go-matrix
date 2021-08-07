package ca.upperapps.api

import ca.upperapps.api.dto.GoalDTO
import ca.upperapps.domain.GoalRepository
import ca.upperapps.domain.GoalService
import ca.upperapps.domain.Option
import ca.upperapps.domain.errorhandling.ErrorHandlerUtils
import org.bson.types.ObjectId
import org.valiktor.ConstraintViolationException
import java.net.URI
import java.util.logging.Logger
import javax.inject.Inject
import javax.ws.rs.*
import javax.ws.rs.core.Response

@Path("/goals")
class GoalResource {
    companion object {
        @Suppress("JAVA_CLASS_ON_COMPANION")
        private val logger: Logger = Logger.getLogger(javaClass.enclosingClass.name)
    }

    @Inject private lateinit var goalRepository: GoalRepository
    @Inject private lateinit var goalService: GoalService

    @GET
    fun listAll(): Response {
        val goals = goalRepository.listAll()
        return Response.ok(goals.map { goal -> GoalDTO.fromDomain(goal) }).build()
    }

    @GET
    @Path("/{id}")
    fun getGoal(@PathParam("id") id: String): Response {
        return try {
            val goal = goalRepository.findById(ObjectId(id))

            if (goal != null) Response.ok(goal).build()
            else Response.status(Response.Status.NOT_FOUND).entity("Goal not found with id $id").build()
        } catch (e: IllegalArgumentException) {
             Response.status(Response.Status.BAD_REQUEST).entity("Invalid id format $id").build()
        }
    }

    @POST
    fun createGoal(goalDTO: GoalDTO): Response {
        return try {
            val goalSaved = goalService.save(goalDTO.toDomain())
            Response.created(URI.create("/goals/${goalSaved.id}")).entity(GoalDTO.fromDomain(goalSaved)).build()
        } catch (e: ConstraintViolationException) {
            Response.status(Response.Status.BAD_REQUEST)
                .entity(ErrorHandlerUtils.getValidationMessage(e))
                .build()
        }
    }

    @PUT
    fun updateGoal(updatedGoalDTO: GoalDTO): Response {
        return try {
            val updatedGoal = goalService.updateGoalInfo(updatedGoalDTO.toDomain())
            Response.created(URI.create("/goals/${updatedGoal.id}")).entity(GoalDTO.fromDomain(updatedGoal)).build()
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
    fun listAllCriteria(@PathParam("goalId") goalId: String): Response = Response.ok().build()


    @DELETE
    @Path("/{goalId}/criteria/{criteriaId}")
    fun deleteCriteria(@PathParam("goalId") goalId: String, @PathParam("criteriaId") criteriaId: String): Response {
        // TODO Implement this method

        return Response.noContent().build()
    }

    // TODO Implement this method
    @GET
    @Path("/{goalId}/options")
    fun listAllOptions(@PathParam("goalId") goalId: String): Response = Response.ok().build()

    @POST
    @Path("/{goalId}/options")
    fun saveOptions(option: List<Option>): Response {
        // TODO Implement this method

        return Response.ok().build()
    }

    @PUT
    @Path("/{goalId}/options")
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