package ca.upperapps.domain

import org.bson.types.ObjectId

data class CriteriaPair(
    val id: ObjectId = ObjectId(),
    var score: Int = 0
)