package ca.upperapps.domain

import org.bson.types.ObjectId

data class CriteriaPair(
    val id: ObjectId = ObjectId(),
    val pair: Pair<Criteria, Criteria>,
    var score: Int = 0
)