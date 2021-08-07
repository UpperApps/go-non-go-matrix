package ca.upperapps.domain

import org.bson.types.ObjectId

// TODO
data class CriteriaScore(
    val id: ObjectId = ObjectId(),
    var score: Int = 0
)