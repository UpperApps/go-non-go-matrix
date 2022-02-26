package ca.upperapps.domain

import org.bson.codecs.pojo.annotations.BsonCreator
import org.bson.codecs.pojo.annotations.BsonId
import org.bson.codecs.pojo.annotations.BsonProperty
import org.bson.types.ObjectId
import org.valiktor.functions.hasSize
import org.valiktor.validate

data class EvaluatedItem @BsonCreator constructor(
    @BsonId val id: ObjectId,
    @BsonProperty("name") val name: String,
    @BsonProperty("description") val description: String?,
) {
    init {
        validate(this) {
            validate(EvaluatedItem::name).hasSize(5, 30)
            validate(EvaluatedItem::description).hasSize(0, 140)
        }
    }
}