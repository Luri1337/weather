package util.filter;

import jakarta.servlet.*;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import model.Session;
import org.springframework.stereotype.Component;
import service.SessionService;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
public class SessionFilter implements Filter {
    private final SessionService sessionService;

    public SessionFilter(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

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
            response.sendRedirect(request.getContextPath() + "/login");
            return;
        }

        Session session = sessionService.getSession(sessionId);
        if(session.getExpiresAt().isBefore(LocalDateTime.now())){
            sessionService.invalidate(sessionId);
            response.sendRedirect(request.getContextPath() + "/login");
            return;
        }

        request.setAttribute("user", session.getUser());
        filterChain.doFilter(request, response);
    }
}
