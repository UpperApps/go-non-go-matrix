package ca.upperapps.domain

import io.quarkus.mongodb.panache.kotlin.PanacheMongoRepository
import org.bson.types.ObjectId
import javax.enterprise.context.ApplicationScoped

@ApplicationScoped
class GoalRepository: PanacheMongoRepository<Goal> {
    fun listAllUserGoals(userId: String):List<Goal> {
        return list("user._id", ObjectId(userId))
    }
}