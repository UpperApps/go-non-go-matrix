package ca.upperapps.domain

import org.bson.types.ObjectId

// TODO Finish implementation
data class EvaluatedItemScore(
    val id: ObjectId = ObjectId(),
    val criteriaId: ObjectId,
    val evaluatedItemId: ObjectId,
    var score: Int = 0
)