package util.interceptor;

import dto.UserDto;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import model.Session;
import model.User;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import service.UserService;
import service.authentication.CookieService;
import service.authentication.SessionService;

import java.time.LocalDateTime;

 @Component
public class SessionInterceptor implements HandlerInterceptor {

    private final SessionService sessionService;
    private final CookieService cookieService;

    public SessionInterceptor(SessionService sessionService, CookieService cookieService) {
        this.sessionService = sessionService;
        this.cookieService = cookieService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String sessionId = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("sessionId")) {
                    sessionId = cookie.getValue();
                    break;
                }
            }
        }

        if(sessionId == null){
            response.sendRedirect("/");
            return false;
        }

        Session session = sessionService.getSession(sessionId);
        if(session.getExpiresAt().isBefore(LocalDateTime.now())){
            sessionService.invalidate(sessionId);
            response.addCookie(cookieService.deleteCookie(String.valueOf(session.getId())));
            response.sendRedirect("/");
            return false;
        }

        User user = session.getUser();
        request.setAttribute("user", new UserDto(user.getLogin(), user.getPassword()));
        return true;
    }


}
