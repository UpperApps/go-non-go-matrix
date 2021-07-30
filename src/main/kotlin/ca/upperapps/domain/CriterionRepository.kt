package ca.upperapps.domain

import io.quarkus.mongodb.panache.kotlin.PanacheMongoRepository
import javax.enterprise.context.ApplicationScoped

@ApplicationScoped
class CriterionRepository: PanacheMongoRepository<Criterion> {
}