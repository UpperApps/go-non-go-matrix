package ca.upperapps.domain

import io.quarkus.mongodb.panache.kotlin.PanacheMongoCompanion
import io.quarkus.mongodb.panache.kotlin.PanacheMongoEntity
import org.valiktor.functions.hasSize
import org.valiktor.functions.isNotBlank
import org.valiktor.validate
import java.util.*

// TODO Check if this class can become a dataclass. Compare the object saved with the Option object.
data class Criteria(val name: String = UUID.randomUUID().toString()) : PanacheMongoEntity() {
    companion object : PanacheMongoCompanion<Criteria>

    init {
        validate(this) {
            validate(Criteria::name).isNotBlank().hasSize(1, 50)
        }
    }
}
