package ca.upperapps.domain

import io.quarkus.mongodb.panache.common.MongoEntity
import org.bson.types.ObjectId

@MongoEntity(collection="criterion")
class Criterion {
    var id: ObjectId? = null
    lateinit var name: String
}
