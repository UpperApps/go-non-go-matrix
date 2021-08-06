package ca.upperapps.domain

import com.fasterxml.jackson.annotation.JsonInclude
import io.quarkus.mongodb.panache.common.MongoEntity
import org.bson.codecs.pojo.annotations.BsonCreator
import org.bson.codecs.pojo.annotations.BsonId
import org.bson.codecs.pojo.annotations.BsonProperty
import org.bson.types.ObjectId
import org.valiktor.functions.hasSize
import org.valiktor.functions.isNotBlank
import org.valiktor.validate

@MongoEntity(collection = "goals")
@JsonInclude(JsonInclude.Include.NON_NULL)
data class Goal @BsonCreator constructor(
    @BsonId var id: ObjectId? = null,
    @BsonProperty("name") val name: String,
    @BsonProperty("user") val user: User,
    @BsonProperty("description") val description: String? = null,
    @BsonProperty("criteria") val criteria: List<Criteria>? = null,
    @BsonProperty("options") val options: List<Option>? = null,
    @BsonProperty("judgementMatrix") val judgementMatrix: JudgementMatrix? = null,
    @BsonProperty("scenario") val scenario: List<Scenario>? = null
) {
    init {
        validate(this) {
            validate(Goal::name).isNotBlank().hasSize(1, 50)
            validate(Goal::description).hasSize(0, 140)
        }
    }
}