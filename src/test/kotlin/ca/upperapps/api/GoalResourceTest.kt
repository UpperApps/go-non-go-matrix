package ca.upperapps.api

import ca.upperapps.domain.Goal
import ca.upperapps.domain.User
import com.fasterxml.jackson.databind.ObjectMapper
import io.quarkus.panache.mock.PanacheMock
import io.quarkus.test.junit.QuarkusTest
import io.restassured.RestAssured.given
import io.restassured.http.ContentType
import org.hamcrest.CoreMatchers.`is`
import org.hamcrest.MatcherAssert.assertThat
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.mockito.Mockito.`when`

@QuarkusTest
class GoalResourceTest {
    companion object {
        lateinit var jsonParser: ObjectMapper

        @BeforeAll
        @JvmStatic
        fun setup() {
            jsonParser = ObjectMapper()
        }
    }

    @Test
    fun getGoalById() {
        val user = User("Name", "Surname", "username", "email@mail")
        val goal = Goal(name = "Test", user = user)

        PanacheMock.mock(Goal::class.java)
        `when`(Goal.listAll()).thenReturn(listOf(goal))

        try {
            given()
                .contentType(ContentType.JSON)
                .`when`().get("/goals/${goal.id}")
                .then()
                .statusCode(200)
                .extract()
                .body()
                .`as`(Goal::class.java).apply {
                    assertThat(this.id, `is`(goal.id))
                    assertThat(this.name, `is`(goal.name))
                    assertThat(this.user.firstName, `is`(goal.user.firstName))

                }
        } finally {
//            goal.delete()
        }

    }
}