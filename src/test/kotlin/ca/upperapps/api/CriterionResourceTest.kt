package ca.upperapps.api

import io.quarkus.test.junit.QuarkusTest
import io.restassured.RestAssured.given
import io.restassured.http.ContentType
import org.hamcrest.CoreMatchers.`is`
import org.junit.jupiter.api.Test

@QuarkusTest
class CriterionResourceTest {

    @Test
    fun testHelloEndpoint() {
        given()
            .contentType(ContentType.JSON)
            .`when`().get("/criteria")
            .then()
            .statusCode(200)
            .body("size()",`is`(1))
    }

}