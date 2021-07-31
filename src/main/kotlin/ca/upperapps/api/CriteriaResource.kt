package ca.upperapps.api

import ca.upperapps.domain.Criteria
import org.bson.types.ObjectId
import java.lang.IllegalArgumentException
import java.net.URI
import java.util.logging.Level
import java.util.logging.Logger
import javax.ws.rs.*
import javax.ws.rs.core.MediaType
import javax.ws.rs.core.Response

@Path("/criteria")
class CriteriaResource {
    companion object {
        @Suppress("JAVA_CLASS_ON_COMPANION")
        private val logger: Logger = Logger.getLogger(javaClass.enclosingClass.name)
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    fun listAll(): Response = Response.ok(Criteria.listAll()).build()

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    fun getCriteria(@PathParam("id") id: String): Response {
        try {
            val criteria = Criteria.findById(ObjectId(id))
            if (criteria != null) {
                return Response.ok(criteria).build()
            }
        } catch (e: IllegalArgumentException) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Invalid id format $id").build()
        }
        return Response.status(Response.Status.NOT_FOUND).entity("Criteria not found for id $id").build()
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    fun saveCriteria(criteria: Criteria): Response {
        criteria.persist()
        return Response.created(URI.create("/criteria/${criteria.id}")).entity(criteria).build()
    }

    @PUT
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    fun updateCriteria(updatedCriteria: Criteria): Response {
        updatedCriteria.update()
        return Response.created(URI.create("/criteria/${updatedCriteria.id}")).entity(updatedCriteria).build()
    }

    @DELETE
    @Path("/{id}")
    fun deleteCriteria(@PathParam("id") id: String): Response {
        Criteria.deleteById(ObjectId(id))
        return Response.noContent().build()
    }
}