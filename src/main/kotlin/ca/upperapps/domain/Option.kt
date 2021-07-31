package ca.upperapps.domain

import io.quarkus.mongodb.panache.common.MongoEntity
import io.quarkus.mongodb.panache.kotlin.PanacheMongoCompanion
import io.quarkus.mongodb.panache.kotlin.PanacheMongoEntity

@MongoEntity(collection = "option")
class Option: PanacheMongoEntity() {
companion object: PanacheMongoCompanion<Option>

    lateinit var name: String
    val description: String? = null
    var optionScore: Map<Criteria, Int>? = null
}