package ca.upperapps.api

import ca.upperapps.api.dto.GoalDTO
import ca.upperapps.domain.*
import ca.upperapps.domain.exceptions.ErrorHandlerUtils
import ca.upperapps.domain.exceptions.ExceptionHandler
import ca.upperapps.domain.exceptions.EntityNotFoundException
import org.bson.types.ObjectId
import org.eclipse.microprofile.openapi.annotations.Operation
import org.eclipse.microprofile.openapi.annotations.media.Content
import org.eclipse.microprofile.openapi.annotations.media.Schema
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses
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

    @Inject
    private lateinit var goalRepository: GoalRepository

    @Inject
    private lateinit var goalService: GoalService

    @GET
    fun listAll(): Response {
        val goals = goalRepository.listAll()
        return Response.ok(goals.map { goal -> GoalDTO.fromDomain(goal) }).build()
    }

    @GET
    @Path("/{id}")
    @Operation(
        summary = "Get goal by ID",
        description = "Get a user goal by goal ID."
    )
    @APIResponses(
        value = [
            APIResponse(
                responseCode = "200",
                description = "Success",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Goal::class))]
            ),
            APIResponse(
                responseCode = "404",
                description = "Goal not found for a given ID",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = ExceptionHandler.ErrorResponseBody::class))]
            ),
            APIResponse(
                responseCode = "400",
                description = "ID format is not valid",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = ExceptionHandler.ErrorResponseBody::class))]
            )
        ]
    )
    @Throws(EntityNotFoundException::class)
    fun getGoal(@PathParam("id") id: String): Response {
        return try {
            val goal = goalRepository.findById(ObjectId(id))

            if (goal != null) Response.ok(goal).build()
            else throw EntityNotFoundException("Goal not found for id $id")
        } catch (e: IllegalArgumentException) {
            throw BadRequestException("Invalid id format $id")
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
    fun listAllCriteria(@PathParam("goalId") goalId: String): Response {
        val criteriaList: List<Criteria> = goalService.getCriteria(goalId)
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