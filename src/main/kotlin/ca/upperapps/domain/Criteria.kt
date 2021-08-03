package ca.upperapps.domain

import io.quarkus.mongodb.panache.common.MongoEntity
import io.quarkus.mongodb.panache.kotlin.PanacheMongoEntityBase
import org.bson.codecs.pojo.annotations.BsonCreator
import org.bson.codecs.pojo.annotations.BsonId
import org.bson.codecs.pojo.annotations.BsonProperty
import org.bson.types.ObjectId
import org.valiktor.functions.hasSize
import org.valiktor.functions.isNotBlank
import org.valiktor.validate

// TODO Check if this class can become a dataclass. Compare the object saved with the Option object.
@MongoEntity
data class Criteria @BsonCreator constructor (@BsonId val id: ObjectId, @BsonProperty("name") val name: String) : PanacheMongoEntityBase() {
    init {
        validate(this) {
            validate(Criteria::name).isNotBlank().hasSize(1, 50)
        }
    }
}
