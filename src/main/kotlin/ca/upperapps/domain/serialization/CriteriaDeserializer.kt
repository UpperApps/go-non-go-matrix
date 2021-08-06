package ca.upperapps.domain.serialization

import ca.upperapps.domain.Criteria
import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.deser.std.StdDeserializer
import com.fasterxml.jackson.databind.node.ObjectNode
import java.util.logging.Level
import java.util.logging.Logger
import kotlin.reflect.KParameter
import kotlin.reflect.jvm.javaType

class CriteriaDeserializer() : StdDeserializer<Criteria>(Criteria::class.java) {

    companion object {
        @Suppress("JAVA_CLASS_ON_COMPANION")
        private val logger: Logger = Logger.getLogger(javaClass.enclosingClass.name)
    }

    override fun deserialize(jp: JsonParser, ctxt: DeserializationContext): Criteria {
        logger.log(Level.WARNING, jp.text)
        return jp.readValueAs(Criteria::class.java)
    }

    override fun deserialize(jp: JsonParser, ctxt: DeserializationContext, intoValue: Criteria): Criteria {
//        val node:JsonNode = jp.codec.readTree(jp)
//
//        logger.log(Level.WARNING, node.asText())
//
//        val id: String = node.get("id").asText()
//        val description: String = node.get("description").asText()
//        return Criteria(ObjectId(id), description)
        val copy = intoValue::copy
        val tree = jp.readValueAsTree<ObjectNode>()

        logger.log(Level.WARNING, copy.toString())

        val args = mutableMapOf<KParameter, Any?>()
        for (param: KParameter in copy.parameters) {
            if (!tree.has(param.name)) {
                if (param.isOptional) {
                    continue
                }
                throw RuntimeException("Missing required field: ${param.name}")
            }

            val node = tree.get(param.name)

            if (node == null && !param.type.isMarkedNullable) {
                throw RuntimeException("Got null value for non-nullable field: ${param.name}")
            }

            val javaType = ctxt.typeFactory.constructType(param.type.javaType)
            val reader = ObjectMapper().readerFor(javaType)
            val obj = reader.readValue<Any?>(node)

            println(param.type)

            args[param] = obj
        }

        return copy.callBy(args)
    }
}