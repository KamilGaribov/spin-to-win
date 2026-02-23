from django.core.mail.backends.smtp import EmailBackend

class HeloEmailBackend(EmailBackend):
    def open(self):
        if self.connection:
            return False

        self.connection = self.connection_class(
            host=self.host,
            port=self.port,
            local_hostname="balique.az",  # valid FQDN
            timeout=self.timeout,
        )

        # STARTTLS only when using TLS on 587 (not SSL/465)
        if self.use_tls and not self.use_ssl:
            self.connection.ehlo()
            self.connection.starttls()
            self.connection.ehlo()

        if self.username and self.password:
            self.connection.login(self.username, self.password)

        return True