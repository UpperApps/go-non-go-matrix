package ca.upperapps.domain

import io.quarkus.mongodb.panache.common.MongoEntity
import io.quarkus.mongodb.panache.kotlin.PanacheMongoCompanion
import io.quarkus.mongodb.panache.kotlin.PanacheMongoEntity

@MongoEntity()
class CriteriaPair: PanacheMongoEntity() {
    companion object: PanacheMongoCompanion<CriteriaPair>

    lateinit var pair: Pair<Criteria, Criteria>
    var score: Int = 0
}