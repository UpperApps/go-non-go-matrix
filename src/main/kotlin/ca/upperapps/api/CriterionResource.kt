package ca.upperapps.api

import ca.upperapps.domain.CriterionRepository
import javax.inject.Inject
import javax.ws.rs.GET
import javax.ws.rs.Path
import javax.ws.rs.Produces
import javax.ws.rs.core.MediaType

@Path("/criteria")
class CriterionResource {

    @Inject
    lateinit var criterionRepository: CriterionRepository

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    fun listAll() = criterionRepository.listAll()
}