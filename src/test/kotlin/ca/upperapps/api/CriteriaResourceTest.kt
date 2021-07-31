package ca.upperapps.api

import ca.upperapps.domain.Criteria
import com.fasterxml.jackson.databind.ObjectMapper
import io.quarkus.test.junit.QuarkusTest
import io.restassured.RestAssured.given
import io.restassured.http.ContentType
import org.hamcrest.CoreMatchers.`is`
import org.hamcrest.MatcherAssert.assertThat
import org.junit.jupiter.api.*
import org.junit.jupiter.api.Assertions.assertEquals
import javax.inject.Inject

@QuarkusTest
class CriteriaResourceTest {

    companion object {
        lateinit var jsonParser: ObjectMapper

        @BeforeAll
        @JvmStatic
        fun setup() {
            jsonParser = ObjectMapper()
        }
    }

    @Test
    fun getCriteriaById() {
        val criteria = Criteria(name = "Test")
        Criteria.persist(criteria)

        given()
            .contentType(ContentType.JSON)
            .`when`().get("/criteria/${criteria.id}")
            .then()
            .statusCode(200)
            .extract()
            .body()
            .`as`(Criteria::class.java).apply {
                assertThat(this.id, `is`(criteria.id))
                assertThat(this.name, `is`(criteria.name))
            }

        criteria.delete()
    }
}