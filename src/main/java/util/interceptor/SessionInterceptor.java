package util.interceptor;

import dto.UserDto;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import model.Session;
import model.User;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import service.SessionService;

import java.time.LocalDateTime;

 @Component
public class SessionInterceptor implements HandlerInterceptor {

    private final SessionService sessionService;

    public SessionInterceptor(SessionService sessionService) {
        this.sessionService = sessionService;
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
            response.sendRedirect(request.getContextPath() + "/home.html");
            return false;
        }

        Session session = sessionService.getSession(sessionId);
        if(session.getExpiresAt().isBefore(LocalDateTime.now())){
            sessionService.invalidate(sessionId);
            response.sendRedirect(request.getContextPath() + "/home.html");
            return false;
        }

        User user = session.getUser();
        request.setAttribute("user", new UserDto(user.getLogin(), user.getPassword()));
        return true;
    }


}
