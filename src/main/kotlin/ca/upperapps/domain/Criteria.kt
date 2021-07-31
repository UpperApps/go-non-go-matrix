package ca.upperapps.domain

import io.quarkus.mongodb.panache.common.MongoEntity
import io.quarkus.mongodb.panache.kotlin.PanacheMongoCompanion
import io.quarkus.mongodb.panache.kotlin.PanacheMongoEntity
import org.bson.types.ObjectId

@MongoEntity(collection = "criteria")
class Criteria(): PanacheMongoEntity() {
    companion object: PanacheMongoCompanion<Criteria>

    constructor(name: String): this() {
        this.name = name
    }

    lateinit var name: String
}
