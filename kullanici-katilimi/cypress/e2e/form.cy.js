
  describe('Form Testleri', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000');
    });
  
    it('İsim inputunda doğru değer girilmeli', () => {
      const name = 'Safa Güler';
  
      cy.get('input[name="fname"]').type(name).should('have.value', name);
    });
  
    it('Email inputunda doğru değer girilmeli', () => {
      const email = 'test@example.com';
  
      cy.get('input[name="email"]').type(email).should('have.value', email);
    });
  
    it('Şifre inputunda doğru değer girilmeli', () => {
      const password = '123456';
  
      cy.get('input[name="password"]').type(password).should('have.value', password);
    });
  
    it('Kullanım koşulları kutusu işaretlenmeli', () => {
      cy.get('input[name="terms"]').check().should('be.checked');
    });
  
    it('Form verileri göndermeli', () => {
        cy.get('input[name="fname"]').type('Safa Güler');
        cy.get('input[name="lname"]').type('Güler');
        cy.get('input[name="email"]').type('test@example.com');
        cy.get('input[name="password"]').type('123456');
        cy.get('input[name="terms"]').check();
        cy.get('input[type="submit"]').click();
      
        cy.wait(2000); // İsteğin tamamlanması için yeterli süre bekleyin (gerektiğinde süreyi ayarlayın).
      
        cy.request('https://reqres.in/api/users')
          .then((response) => {
            expect(response.status).to.eq(200); // Başarılı bir şekilde 201 (Created) yanıtını kontrol edin.
      
            const users = response.body.data;
            const user = users.find((u) => u.fname === 'Safa Güler' && u.lname === 'Güler' && u.email === 'test@example.com');
            expect(user).to.exist; // 'Safa Güler' adına sahip bir kullanıcının bulunup bulunmadığını kontrol edin
            expect(user.password).to.equal('123456');
          });
      });
      
      it('Form doğrulaması hata mesajını göstermeli', () => {
        cy.get('input[name="fname"]').focus().blur();
        cy.get('span.error').should('be.visible').contains('Ad gerekli.');
      });
  });